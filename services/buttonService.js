let buttons = {};

export const addButton = async (name, button) => {
  if (!buttons[name]) buttons[name] = {};
  await new Promise((resolve) => {
    buttons[name][button] = resolve;
  });
  return button;
};

export const buttonClick = (name, button) => {
  if (buttons[name] && buttons[name][button]) {
    buttons[name][button]();
    delete buttons[name][button];
    return { success: true };
  }
  return { success: false };
};

export const listButtons = (name) => {
  return {
    success: true,
    buttons: buttons[name] ? Object.keys(buttons[name]) : [],
  };
};
