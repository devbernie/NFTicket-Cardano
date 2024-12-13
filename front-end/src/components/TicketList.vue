<template>
  <div>
    <h2>Ticket List</h2>
    <ul>
      <li v-for="ticket in tickets" :key="ticket.id">{{ ticket.name }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'TicketList',
  data() {
    return {
      tickets: []
    };
  },
  mounted() {
    this.fetchTickets();
  },
  methods: {
    fetchTickets() {
      // Logic to fetch tickets from the smart contract
    }
  }
};
</script>

<style>
/* Add your styles here */
</style>
