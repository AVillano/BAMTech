using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Http.HttpResults;
using static System.Net.Mime.MediaTypeNames;

namespace StargateAPI.Business.Data
{
    [Table("AstronautDuty")]
    //  just for my reference while I see if anything needs changing
    //  CREATE TABLE IF NOT EXISTS "AstronautDuty"(
    //      "Id" INTEGER NOT NULL CONSTRAINT "PK_AstronautDuty" PRIMARY KEY AUTOINCREMENT,
    //      "PersonId" INTEGER NOT NULL,
    //      "Rank" TEXT NOT NULL,
    //      "DutyTitle" TEXT NOT NULL,
    //      "DutyStartDate" TEXT NOT NULL,
    //      "DutyEndDate" TEXT NULL,
    //      CONSTRAINT "FK_AstronautDuty_Person_PersonId" FOREIGN KEY("PersonId") REFERENCES "Person"("Id") ON DELETE CASCADE
    //  );
    //
    //  CREATE INDEX "IX_AstronautDuty_PersonId" ON "AstronautDuty"("PersonId");
    public class AstronautDuty
    {
        public int Id { get; set; }

        public int PersonId { get; set; }

        public string Rank { get; set; } = string.Empty;

        public string DutyTitle { get; set; } = string.Empty;

        public DateTime DutyStartDate { get; set; }

        public DateTime? DutyEndDate { get; set; }

        public virtual Person Person { get; set; }
    }

    public class AstronautDutyConfiguration : IEntityTypeConfiguration<AstronautDuty>
    {
        public void Configure(EntityTypeBuilder<AstronautDuty> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id).ValueGeneratedOnAdd();
        }
    }
}
