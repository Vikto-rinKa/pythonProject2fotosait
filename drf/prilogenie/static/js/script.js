document.addEventListener('DOMContentLoaded', function() {
    // Получаем элементы вкладок
    const tabLinks = document.querySelectorAll('[role="tab"]');
    const tabContents = document.querySelectorAll('[role="tabpanel"]');

    // Проверяем наличие элементов
    if (tabLinks.length === 0 || tabContents.length === 0) {
        console.warn('Табы не найдены на странице');
        return;
    }

    // Функция для активации вкладки
    function activateTab(tabElement) {
        // Сбрасываем активное состояние у всех вкладок
        tabLinks.forEach(tab => {
            tab.setAttribute('aria-selected', 'false');
            tab.classList.remove('active');
        });

        tabContents.forEach(content => {
            content.classList.remove('active');
        });

        // Активируем выбранную вкладку
        tabElement.setAttribute('aria-selected', 'true');
        tabElement.classList.add('active');

        const tabId = tabElement.getAttribute('aria-controls');
        const tabContent = document.getElementById(tabId);

        if (tabContent) {
            tabContent.classList.add('active');
        } else {
            console.error(`Контент вкладки с id "${tabId}" не найден`);
        }
    }

    // Обработчик клика по вкладке
    function handleTabClick(e) {
        e.preventDefault();
        activateTab(this);
    }

    // Назначаем обработчики событий
    tabLinks.forEach(tab => {
        tab.addEventListener('click', handleTabClick);

        // Добавляем обработку клавиатуры для доступности
        tab.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                activateTab(this);
            }
        });
    });

    // Активируем первую вкладку по умолчанию (или активную при загрузке)
    const initialActiveTab = document.querySelector('[role="tab"][aria-selected="true"]') || tabLinks[0];
    if (initialActiveTab) {
        activateTab(initialActiveTab);
    }
});