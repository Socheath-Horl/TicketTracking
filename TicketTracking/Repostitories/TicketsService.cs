using Microsoft.EntityFrameworkCore;
using TicketTracking.Models;

namespace TicketTracking.Repostitories
{
    public class TicketsService
    {
        private TicketsDbContext _context;
        public TicketsService(TicketsDbContext context)
        {
            _context = context;
        }

        public async Task<Ticket> CreateAsync(Ticket entity)
        {
            var res = await _context.Tickets.AddAsync(entity);
            await _context.SaveChangesAsync();
            return res.Entity;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            bool isDeleted = false;
            var order = await _context.Tickets.FindAsync(id);
            if (order != null)
            {
                _context.Tickets.Remove(order);
                await _context.SaveChangesAsync();
                isDeleted = true;
            }
            return isDeleted;
        }

        public async Task<IEnumerable<Ticket>> GetAsync()
        {
            return await _context.Tickets.ToListAsync();
        }

        public async Task<Ticket> GetAsync(Guid id)
        {
            return await _context.Tickets.FindAsync(id);
        }

        public async Task<Ticket> GetAsync(Guid id, TicketType ticketType)
        {
            return await _context.Tickets.SingleOrDefaultAsync(d => d.Id == id && d.TicketType == ticketType);
        }

        public async Task<bool> UpdateAsync(Guid id, Ticket entity)
        {
            bool isUpdated = false;
            var ticket = await _context.Tickets.FindAsync(id);
            
            await _context.SaveChangesAsync();
            isUpdated = true;
            return isUpdated;
        }

        public async Task<bool> ResolvedAsync(int id)
        {
            bool isUpdated = false;
            var ticket = await _context.Tickets.FindAsync(id);
            if ((ticket != null) || (ticket?.TicketType != TicketType.Resolved))
            {
                ticket.TicketType = TicketType.Resolved;
                await _context.SaveChangesAsync();
                isUpdated = true;
            }
            return isUpdated;
        }
    }
}
