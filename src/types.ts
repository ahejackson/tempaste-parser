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
  attrs?: { [key: string]: string };
  techniques?: ParsedTemTechnique[];
  notes?: string[];
};

export type ParsedTemTechnique = {
  main: string;
  alternatives?: string[];
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
