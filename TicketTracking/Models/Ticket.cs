using System.ComponentModel.DataAnnotations;

namespace TicketTracking.Models
{
    public class Ticket
    {
        [Key]
        public Guid Id { get; set; }
        [Required(ErrorMessage = "Description is Required")]
        public string Description { get; set; }
        [Required(ErrorMessage = "Summary is Required")]
        public string Summary { get; set; }

        public bool Severity { get; set; }
        public bool Priority { get; set; }
        public TicketType TicketType { get; set; }
    }
}
