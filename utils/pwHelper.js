export function showPasswordHandler({
  pwIsVisible,
  setPassword,
  setIcon,
  ref,
}) {
  setPassword(!pwIsVisible);
  let icon = pwIsVisible ? "eye-off" : "eye";
  setIcon(icon);
  ref.current.blur();
}
