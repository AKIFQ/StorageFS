export type Action = 'search' | 'navigate' | 'add' | 'unknown';

export interface VoiceCommandHandlers {
  onAddItem: (itemName: string) => void;
  onSearch: (query: string) => void;
  onNavigate: (target: string) => void;
}

// Command patterns for voice recognition
const commandPatterns = {
  add: /^(?:add|put|create|store)\s+(?:a|an|the)?\s*(.+)$/i,
  move: /^(?:move|transfer|relocate)\s+(.+)\s+to\s+(.+)$/i,
  delete: /^(?:delete|remove|trash)\s+(.+)$/i,
  search: /^(?:search|find|locate|where\s+is)\s+(?:for|a|an|the)?\s*(.+)$/i,
  navigate: /^(?:go\s+to|open|show|navigate\s+to)\s+(.+)$/i
};

interface VoiceCommandResult {
  action: 'add' | 'move' | 'delete' | 'search' | 'navigate' | 'unknown';
  target?: string;
  destination?: string;
  query?: string;
}

export const processVoiceCommand = (command: string): VoiceCommandResult => {
  const normalizedCommand = command.toLowerCase().trim();

  // Check each command type
  for (const [action, pattern] of Object.entries(commandPatterns)) {
    const match = normalizedCommand.match(pattern);
    if (match) {
      switch (action) {
        case 'move':
          return {
            action: 'move',
            target: match[1].trim(),
            destination: match[2].trim()
          };
        case 'search':
          return {
            action: 'search',
            query: match[1].trim()
          };
        case 'navigate':
          return {
            action: 'navigate',
            destination: match[1].trim()
          };
        default:
          return {
            action: action as 'add' | 'delete',
            target: match[1].trim()
          };
      }
    }
  }

  return { action: 'unknown' };
}; 