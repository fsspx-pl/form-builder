export const getText = (children: any[]): string => {
  return children
    .map((child) => {
      if (child.children) {
        return getText(child.children);
      }
      return child.text;
    })
    .join(' ');
};
