import { NavLink as RouterNavLink } from "react-router-dom";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

/**
 * NavLink Component
 * @param {Object} props
 * @param {string} [props.className] - Base CSS classes
 * @param {string} [props.activeClassName] - CSS classes for active state
 * @param {string} [props.pendingClassName] - CSS classes for pending state
 * @param {string} props.to - Navigation target
 */
const NavLink = forwardRef(({ className, activeClassName, pendingClassName, to, ...props }, ref) => {
  return (
    <RouterNavLink
      ref={ref}
      to={to}
      className={({ isActive, isPending }) =>
        cn(className, isActive && activeClassName, isPending && pendingClassName)
      }
      {...props}
    />
  );
});

NavLink.displayName = "NavLink";

export { NavLink };