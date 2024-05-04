using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Http.HttpResults;
using static System.Net.Mime.MediaTypeNames;

namespace StargateAPI.Business.Data
{
    [Table("AstronautDetail")]
    //  just for my reference while I see if anything needs changing
    //  CREATE TABLE IF NOT EXISTS "AstronautDetail"(
    //      "Id" INTEGER NOT NULL CONSTRAINT "PK_AstronautDetail" PRIMARY KEY AUTOINCREMENT,
    //      "PersonId" INTEGER NOT NULL,
    //      "CurrentRank" TEXT NOT NULL,
    //      "CurrentDutyTitle" TEXT NOT NULL,
    //      "CareerStartDate" TEXT NOT NULL,
    //      "CareerEndDate" TEXT NULL,
    //      CONSTRAINT "FK_AstronautDetail_Person_PersonId" FOREIGN KEY("PersonId") REFERENCES "Person"("Id") ON DELETE CASCADE
    //  );
    //
    //  CREATE UNIQUE INDEX "IX_AstronautDetail_PersonId" ON "AstronautDetail"(
    //      "PersonId"
    //  );
    public class AstronautDetail
    {
        public int Id { get; set; }

        public int PersonId { get; set; }

        public string CurrentRank { get; set; } = string.Empty;

        public string CurrentDutyTitle { get; set; } = string.Empty;

        public DateTime CareerStartDate { get; set; }

        public DateTime? CareerEndDate { get; set; }

        public virtual Person Person { get; set; }
    }

    public class AstronautDetailConfiguration : IEntityTypeConfiguration<AstronautDetail>
    {
        public void Configure(EntityTypeBuilder<AstronautDetail> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id).ValueGeneratedOnAdd();
        }
    }
}
