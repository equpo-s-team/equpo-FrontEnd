import './app.css';
import { useRevealAll } from './hooks/useReveal';
import Router from './Router';

export default function App() {
    const { containerRef } = useRevealAll();

    return (
        <Router/>
    );
}
