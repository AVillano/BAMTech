using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Http.HttpResults;
using static System.Net.Mime.MediaTypeNames;

namespace StargateAPI.Business.Data
{
    [Table("Person")]
    //  just for my reference while I see if anything needs changing
    //  CREATE TABLE IF NOT EXISTS "Person"(
    //      "Id" INTEGER NOT NULL CONSTRAINT "PK_Person" PRIMARY KEY AUTOINCREMENT,
    //      "Name" TEXT NOT NULL
    //  );
    //  CREATE UNIQUE INDEX "IX_Person_Name" ON "Person"("Name");
    public class Person
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public virtual AstronautDetail? AstronautDetail { get; set; }

        public virtual ICollection<AstronautDuty> AstronautDuties { get; set; } = new HashSet<AstronautDuty>();
    }

    public class PersonConfiguration : IEntityTypeConfiguration<Person>
    {
        public void Configure(EntityTypeBuilder<Person> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id).ValueGeneratedOnAdd();
            builder.HasOne(z => z.AstronautDetail).WithOne(z => z.Person).HasForeignKey<AstronautDetail>(z => z.PersonId);
            builder.HasMany(z => z.AstronautDuties).WithOne(z => z.Person).HasForeignKey(z => z.PersonId);
            builder.HasIndex(p => p.Name).IsUnique();
        }
    }
}
