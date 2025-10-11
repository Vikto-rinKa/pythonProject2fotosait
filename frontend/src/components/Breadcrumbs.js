import React from 'react';
import { useLocation, Link } from 'react-router-dom';

function Breadcrumbs() {
  const location = useLocation();
  
  const getBreadcrumbName = (path) => {
    switch (path) {
      case '/':
        return 'Главная';
      case '/about':
        return 'О себе';
      case '/portfolio':
        return 'Портфолио';
      case '/services':
        return 'Услуги';
      case '/contact':
        return 'Контакты';
      default:
        return 'Страница';
    }
  };

  const pathSegments = location.pathname.split('/').filter(segment => segment !== '');
  const breadcrumbs = pathSegments.map((segment, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/');
    return {
      name: getBreadcrumbName(path),
      path: path,
      isLast: index === pathSegments.length - 1
    };
  });

  // Добавляем главную страницу в начало
  if (location.pathname !== '/') {
    breadcrumbs.unshift({
      name: 'Главная',
      path: '/',
      isLast: false
    });
  }

  return (
    <nav className="breadcrumbs" aria-label="Навигационные хлебные крошки">
      <ol className="breadcrumb-list">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={index} className="breadcrumb-item">
            {breadcrumb.isLast ? (
              <span className="breadcrumb-current" aria-current="page">
                {breadcrumb.name}
              </span>
            ) : (
              <Link to={breadcrumb.path} className="breadcrumb-link">
                {breadcrumb.name}
              </Link>
            )}
            {!breadcrumb.isLast && (
              <span className="breadcrumb-separator" aria-hidden="true">
                ›
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
