export function fillTemplate(
  template: string,
  variables: Record<string, string>
): string {
  return template.replace(/{{(.*?)}}/g, (_, key) => {
    return variables[key.trim()] || "";
  });
}
