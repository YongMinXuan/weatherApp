import React from "react";
import Toggle from "react-toggle";
import { useColorScheme } from "./useColorScheme";
import Form from "react-bootstrap/Form";

export const DarkModeToggle = () => {
  const { isDark, setIsDark } = useColorScheme();
  return (
    // <Toggle
    //   checked={isDark}
    //   onChange={({ target }) => setIsDark(target.checked)}
    //   icons={{ checked: "🌙", unchecked: "🔆" }}
    //   aria-label="Dark mode toggle"
    // />
    <Form>
      <Form.Check // prettier-ignore
        type="switch"
        id="custom-switch"
        label="Dark Mode On"
        checked={isDark}
        onChange={({ target }) => setIsDark(target.checked)}
        icons={{ checked: "🌙", unchecked: "🔆" }}
        aria-label="Dark mode toggle"
      />
    </Form>
  );
};
