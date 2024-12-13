<template>
  <div class="refund-container">
    <h2>Refund Ticket</h2>
    <form @submit.prevent="submitRefund">
      <div>
        <label for="ticketId">Ticket ID:</label>
        <input type="text" v-model="ticketId" required />
      </div>
      <div>
        <label for="walletAddress">Wallet Address:</label>
        <input type="text" v-model="walletAddress" required />
      </div>
      <button type="submit">Request Refund</button>
    </form>
    <div v-if="transactionHash">
      <h3>Transaction Hash:</h3>
      <p>{{ transactionHash }}</p>
    </div>
    <div v-if="errorMessage" class="error">
      <p>{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      ticketId: '',
      walletAddress: '',
      transactionHash: '',
      errorMessage: ''
    };
  },
  methods: {
    async submitRefund() {
      this.transactionHash = '';
      this.errorMessage = '';
      const baseURL = process.env.VUE_APP_API_BASE_URL;
      try {
        const response = await axios.post(`${baseURL}/refund`, {
          ticketId: this.ticketId,
          walletAddress: this.walletAddress
        });
        this.transactionHash = response.data.transactionHash;
      } catch (error) {
        this.errorMessage = error.response ? error.response.data.error : 'An error occurred';
      }
    }
  }
};
</script>

<style scoped>
.refund-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.error {
  color: red;
}
</style>
