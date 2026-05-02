// Merges @react-three/fiber ThreeElements into React's JSX namespace.
// With moduleResolution:bundler + jsx:react-jsx, TypeScript resolves intrinsic
// elements from React.JSX.IntrinsicElements, so that is what we augment.
import type { ThreeElements } from '@react-three/fiber';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}
