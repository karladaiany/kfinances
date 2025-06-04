// Gerenciador de temas para a plataforma FinançasPro
// Este script controla a alternância entre os temas claro e escuro (Dracula)

// Função para verificar a preferência de tema do usuário
function getThemePreference() {
  // Verificar se há uma preferência salva no localStorage
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    return savedTheme;
  }
  
  // Verificar preferência do sistema
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  // Padrão para tema claro
  return 'light';
}

// Função para aplicar o tema
function applyTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.add('dark-theme');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#282a36');
  } else {
    document.body.classList.remove('dark-theme');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#f8f9fa');
  }
  
  // Salvar preferência
  localStorage.setItem('theme', theme);
  
  // Atualizar ícone do botão de tema
  updateThemeToggleIcon(theme);
}

// Função para alternar o tema
function toggleTheme() {
  const currentTheme = localStorage.getItem('theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  applyTheme(newTheme);
  
  // Disparar evento personalizado para notificar componentes
  window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: newTheme } }));
  
  return newTheme;
}

// Função para atualizar o ícone do botão de tema
function updateThemeToggleIcon(theme) {
  const themeToggleButton = document.getElementById('theme-toggle');
  if (!themeToggleButton) return;
  
  if (theme === 'dark') {
    themeToggleButton.innerHTML = '<i class="fas fa-sun"></i>';
    themeToggleButton.setAttribute('title', 'Mudar para tema claro');
  } else {
    themeToggleButton.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggleButton.setAttribute('title', 'Mudar para tema escuro');
  }
}

// Inicializar tema quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  // Aplicar tema inicial
  const initialTheme = getThemePreference();
  applyTheme(initialTheme);
  
  // Configurar botão de alternância de tema
  const themeToggleButton = document.getElementById('theme-toggle');
  if (themeToggleButton) {
    themeToggleButton.addEventListener('click', toggleTheme);
  }
  
  // Ouvir mudanças na preferência do sistema
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      const newTheme = e.matches ? 'dark' : 'light';
      applyTheme(newTheme);
    });
  }
});

// Exportar funções para uso em outros módulos
export { getThemePreference, applyTheme, toggleTheme };
