const keywordTags: Array<[RegExp, string]> = [
  [/\b(buy|purchase|order)\b/i, 'shopping'],
  [/\b(meeting|standup|retro|zoom)\b/i, 'meeting'],
  [/\b(todo|task|fix|bug)\b/i, 'task'],
  [/\burgent|asap|deadline\b/i, 'urgent'],
  [/\bBTC|ETH|crypto|coin\b/i, 'crypto'],
  [/\bAAPL|MSFT|GOOGL|TSLA|stock\b/i, 'stocks'],
]

export function autoTags(input: string): string[] {
  const set = new Set<string>()
  for (const [re, tag] of keywordTags) {
    if (re.test(input)) set.add(tag)
  }
  return Array.from(set).sort()
}
