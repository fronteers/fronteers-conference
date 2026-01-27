require('dotenv').config();

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const headers = {
  Authorization: `Token token=${process.env.TITO_API_KEY}`,
  Accept: 'application/json',
}
const getAllTicketsUrl = `https://api.tito.io/v3/${process.env.TITO_ACCOUNT_SLUG}/${process.env.TITO_EVENT_SLUG}/tickets?view=extended&search[sort]=first_name&search[direction]=asc`;

const result = async () => {
  if (!process.env.TITO_API_KEY) {
    return [];
  }

  const result = await fetch(getAllTicketsUrl, {
    headers,
  }).then((response) => response.json());

  return result.tickets
    .filter((ticket) => ticket.responses && ticket.responses[process.env.TITO_QUESTION_SLUG] === 'yes')
    .filter((ticket) => !!ticket.name)
    .map((ticket) => ticket.name);
}

module.exports = result;
