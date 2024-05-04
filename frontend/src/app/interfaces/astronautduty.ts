export interface AstronautDuty {
    id: number;
    personId: number;
    rank: string;
    dutyTitle: string;
    dutyStartDate: Date;
    dutyEndDate: Date;
}

// public int Id { get; set; }
// public int PersonId { get; set; }
// public string Rank { get; set; } = string.Empty;
// public string DutyTitle { get; set; } = string.Empty;
// public DateTime DutyStartDate { get; set; }
// public DateTime? DutyEndDate { get; set; }