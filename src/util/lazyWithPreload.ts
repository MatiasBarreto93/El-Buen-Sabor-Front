import React, { ComponentType, LazyExoticComponent } from 'react';

//ComponentType => any component
//LazyExoticComponent => is a type returned by React.memo() and React.lazy()

//Esta funcion retorna componentes con React.lazy() con la posibilidad de usar un preload para mejorar la performance
export function lazyWithPreload<T extends ComponentType<any>>(
    factory: () => Promise<{ default: T }>
): LazyExoticComponent<T> & { preload: () => Promise<{ default: T }> } {
    const Component = React.lazy(factory);
    (Component as any).preload = factory;
    return Component as LazyExoticComponent<T> & { preload: () => Promise<{ default: T }> };
}
