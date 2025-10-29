import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NewNavbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const buttonClass = (path) =>
    isActive(path)
      ? // active state → teal background, black text, no hover change
        "bg-teal-400 text-black cursor-default"
      : // normal state → white text, teal on hover, teal background + black text on active press
        "text-white hover:text-teal-400 active:bg-teal-400 active:text-black";

  return (
    <nav className="fixed top-0 left-0 z-50 w-full border-b bg-neutral-900/30 backdrop-blur-md border-teal-400/20">
      <div className="flex items-center justify-between p-4 mx-auto max-w-7xl">
        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-semibold tracking-wide text-teal-400 logo-font"
        >
          DJS Townhall
        </Link>

        {/* Main Links */}
        <div className="flex items-center gap-3">
          <Link to="/events">
            <Button
              variant="ghost"
              className={`transition-colors ${buttonClass("/events")}`}
            >
              All Events
            </Button>
          </Link>

          <Link to="/myevents">
            <Button
              variant="ghost"
              className={`transition-colors ${buttonClass("/myevents")}`}
            >
              My Events
            </Button>
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button
              variant="ghost"
              className={`transition-colors ${buttonClass("/login")}`}
            >
              Login
            </Button>
          </Link>

          <Link to="/register">
            <Button
              variant="ghost"
              className={`transition-colors ${buttonClass("/register")}`}
            >
              Register
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
