import { LucideIcon } from "lucide-react";

export interface Stat {
  id: string;
  name: string;
  icon: LucideIcon;
  link?: string;
  stat: number;
}

export interface SubscriptionLimits {
  chatbots: {
    allowed: boolean;
    limit: Number;
    result: Number;
  };
  conversations: {
    allowed: boolean;
    limit?: Number;
    result?: Number;
  };
  contacts: {
    allowed: boolean;
    limit?: Number;
    result?: Number;
  };
  vectors: {
    allowed: boolean;
    limit?: Number;
    result?: Number;
  };
}

export interface SubscriptionLimit {
  allowed: boolean;
  result: number;
  limit: string | number | boolean;
}
