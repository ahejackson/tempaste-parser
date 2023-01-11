export type ParsedTem = {
  name?: string;
  nickname?: string;
  gender?: "Male" | "Female" | "-";
  gear?: string;
  trait?: string;
  luma?: boolean;
  level?: number;
  tvs?: ParsedTemStats;
  svs?: ParsedTemStats;
  techniques?: string[];
  notes?: string[];
};

export type ParsedTemStats = {
  hp?: number;
  sta?: number;
  spe?: number;
  atk?: number;
  def?: number;
  spatk?: number;
  spdef?: number;
};
