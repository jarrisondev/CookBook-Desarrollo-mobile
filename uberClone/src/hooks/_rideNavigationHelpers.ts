import type { NavigationProp } from '@react-navigation/native';

type AnyNav =
  | (NavigationProp<Record<string, object | undefined>> & {
      getState?: () => {
        routeNames?: readonly string[];
        routes?: { name: string }[];
      } | undefined;
      getParent?: () => AnyNav | undefined;
      canGoBack?: () => boolean;
      popToTop?: () => void;
    })
  | undefined;

export type RideNav = AnyNav;

/**
 * Walks up the navigator tree until it finds one whose routeNames include
 * `target`. Bootstrap hooks are mounted inside the bottom tabs, but the
 * ride-flow screens live in the parent stack — without walking up, navigate
 * calls would emit "no screen named X" warnings before the action bubbles
 * up to the right navigator.
 */
function findStackOwning(nav: AnyNav, target: string): AnyNav {
  let current = nav;
  while (current) {
    const routeNames = current.getState?.()?.routeNames ?? [];
    if (routeNames.includes(target)) return current;
    current = current.getParent?.();
  }
  return undefined;
}

export function findRideStack(nav: AnyNav, anchor: string): AnyNav {
  return findStackOwning(nav, anchor) ?? nav;
}

export function getCurrentRouteName(stack: AnyNav): string | undefined {
  return stack?.getState?.()?.routes?.at(-1)?.name;
}

/**
 * Deferred navigate to avoid "setState during render" warnings when the
 * snapshot listener fires while another screen is mid-render.
 */
export function navigateOnStack(stack: AnyNav, target: string) {
  setTimeout(() => {
    (stack?.navigate as ((name: string) => void) | undefined)?.(target);
  }, 0);
}

export function popOutOfRideFlow(
  stack: AnyNav,
  currentRoute: string | undefined,
  rideFlowScreens: ReadonlySet<string>,
) {
  if (!currentRoute || !rideFlowScreens.has(currentRoute)) return;
  if (stack?.canGoBack?.()) stack.popToTop?.();
}
