interface StyleSheet {
  insertRule(rule: string, index?: number);
  cssRules: CSSRuleList;
  deleteRule(index: number);
}

type CSSTemplate = [TemplateStringsArray, ...any[]];
