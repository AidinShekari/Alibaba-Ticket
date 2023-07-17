const axios = require('axios');
const momentj = require('moment-jalaali');
const Discord = require('discord.js');
const cities = require('./cities.json');
const config = require('./config.json');

const urls = config.urls;
const webhookUrl = config.webhookUrl;

function convertToGregorianDate(persianDate) {
  const gregorianDate = momentj(persianDate, 'jYYYY-jMM-jDD').format('YYYY-MM-DD');
  return gregorianDate;
}

function getOriginCityCode(cityCode) {
  return Object.keys(cities).find(key => cities[key] === cityCode);
}

async function sendTrainDetailsToWebhook(webhookUrl, originCode, destinationCode, departureDate, availableTrains, url) {
  try {
    const totalSeats = availableTrains.reduce((total, train) => total + train.seat, 0);

    const embed = new Discord.MessageEmbed()
      .setTitle(`🚂 Train Ticket Availability | ${originCode} - ${destinationCode}`)
      .setURL(url)
      .setDescription(`📅 **Date:** ${departureDate}\n\n🪑 **Total Seats:** ${totalSeats}`)
      .setColor('#FFFFFF');

    availableTrains.forEach(train => {
      const formattedPrice = (train.cost / 10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

      embed.addField(
        `🔢 Train Number ${train.trainNumber}`,
        `🚪 **Wagon:** ${train.wagonName}\n🪑 **Seat:** ${train.seat}\n💵 **Price:** ${formattedPrice}`,
        true
      );
    });

    const webhook = new Discord.WebhookClient({ url: webhookUrl });
    await webhook.send({ embeds: [embed] });
  } catch (error) {
    console.error('Error sending webhook:', error.message);
  }
}

async function sendFlightDetailsToWebhook(webhookUrl, originCode, destinationCode, departureDate, departingFlights, url) {
  try {
    const totalSeats = departingFlights.reduce((total, flight) => total + flight.seat, 0);

    const embed = new Discord.MessageEmbed()
      .setTitle(`✈️ Flight Ticket Availability | ${originCode} - ${destinationCode}`)
      .setURL(url)
      .setDescription(`📅 **Date:** ${departureDate}\n\n🪑 **Total Seats:** ${totalSeats}`)
      .setColor('#FFFFFF');

    departingFlights.forEach(flight => {
      const departureTime = flight.leaveDateTime.split('T')[1].substring(0, 5);
      const arrivalTime = flight.arrivalDateTime.split('T')[1].substring(0, 5);
      const formattedPrice = (flight.priceAdult / 10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

      embed.addField(
        `🔢 Flight Number ${flight.flightNumber}`,
        `🛫 **Departure Time:** ${departureTime}\n🛬 **Arrival Time:** ${arrivalTime}\n🪑 **Seat:** ${flight.seat}\n💵 **Price:** ${formattedPrice}`,
        true
      );
    });

    const webhook = new Discord.WebhookClient({ url: webhookUrl });
    await webhook.send({ embeds: [embed] });
  } catch (error) {
    console.error('Error sending webhook:', error.message);
  }
}

async function sendBusDetailsToWebhook(webhookUrl, originCityName, destinationCityName, departureDate, buses, url) {
  try {
    let totalAvailableSeats = 0;

    const embed = new Discord.MessageEmbed()
      .setTitle(`🚌 Bus Ticket Availability | ${originCityName} - ${destinationCityName}`)
      .setURL(url)
      .setDescription(`📅 **Date:** ${departureDate}`)
      .setColor('#FFFFFF');

    buses.forEach((bus, index) => {
      const formattedPrice = (bus.price / 10).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      const availableSeats = bus.availableSeats;
      const totalSeats = bus.totalSeats;
      totalAvailableSeats += availableSeats;

      if (availableSeats > 0) {
        embed.addField(
          `\n\n🔢 Bus ${index + 1}`,
          `⏰ **Departure Time:** ${bus.departureTime}\n🚌 **Bus Type:** ${bus.busType}\n🪑 **Seat:** ${availableSeats}\n💵 **Price:** ${formattedPrice}`,
          true
        );
      }
    });

    if (totalAvailableSeats > 0) {
      const description = embed.description + `\n\n🪑 **Total Seats:** ${totalAvailableSeats}`;
      embed.setDescription(description);

      const webhook = new Discord.WebhookClient({ url: webhookUrl });
      await webhook.send({ embeds: [embed] });
    }
  } catch (error) {
    console.error('Error sending webhook:', error.message);
  }
}

async function checkTrainTicket(url, webhookUrl) {
  try {
    const [originCode, destinationCode] = url.match(/train\/(\w+)-(\w+)/i).slice(1);

    const departureDate = url.match(/departing=(\d{4}-\d{2}-\d{2})/i)[1];
    const gregorianDepartureDate = convertToGregorianDate(departureDate);

    const payload = {
      departureDate: gregorianDepartureDate,
      origin: originCode,
      destination: destinationCode,
      passengerCount: 1,
      isExclusiveCompartment: false,
      ticketType: 'Family',
    };

    const response = await axios.post('https://ws.alibaba.ir/api/v2/train/available', payload);
    const requestId = response.data.result.requestId;

    const trainDetailsResponse = await axios.get(`https://ws.alibaba.ir/api/v2/train/available/${requestId}`);
    const departingTrains = trainDetailsResponse.data.result.departing;

    const availableTrains = departingTrains.filter(train => train.seat > 0);
    if (availableTrains.length > 0) {
      await sendTrainDetailsToWebhook(webhookUrl, originCode, destinationCode, departureDate, availableTrains, url);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function checkFlightAvailability(url, webhookUrl) {
  try {
    const [originCode, destinationCode] = url.match(/flights\/(\w+)-(\w+)/i).slice(1);

    const departureDate = url.match(/departing=(\d{4}-\d{2}-\d{2})/i)[1];
    const gregorianDepartureDate = convertToGregorianDate(departureDate);

    const payload = {
      origin: originCode,
      destination: destinationCode,
      departureDate: gregorianDepartureDate,
      adult: 1,
      child: 0,
      infant: 0
    };

    const response = await axios.post('https://ws.alibaba.ir/api/v1/flights/domestic/available', payload);
    const requestId = response.data.result.requestId;

    const flightDetailsResponse = await axios.get(`https://ws.alibaba.ir/api/v1/flights/domestic/available/${requestId}`);
    const departingFlights = flightDetailsResponse.data.result.departing;

    if (departingFlights && departingFlights.length > 0) {
      const availableFlights = departingFlights.filter(flight => flight.seat && flight.seat > 0);
      if (availableFlights.length > 0) {
        await sendFlightDetailsToWebhook(webhookUrl, originCode, destinationCode, departureDate, availableFlights, url);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function checkBusTicket(url, webhookUrl) {
  try {
    const originCode = url.match(/bus\/(\w+)-/i)[1];
    const destinationCode = url.match(/-(\w+)\?/i)[1];

    const departureDate = url.match(/departing=(\d{4}-\d{2}-\d{2})/i)[1];
    const gregorianDepartureDate = convertToGregorianDate(departureDate);

    const originCityCode = cities[originCode];
    const destinationCityCode = cities[destinationCode];

    const apiUrl = `https://ws.alibaba.ir/api/v2/bus/available?orginCityCode=${originCityCode}&destinationCityCode=${destinationCityCode}&requestDate=${gregorianDepartureDate}&passengerCount=1`;

    const response = await axios.get(apiUrl);
    const availableBuses = response.data.result.availableList;

    if (availableBuses && availableBuses.length > 0) {
      const buses = availableBuses.map((bus) => {
        return {
          departureTime: bus.departureTime,
          busType: bus.busType,
          price: bus.price,
          availableSeats: bus.availableSeats,
          totalSeats: bus.availableSeats + bus.occupiedSeats,
        };
      });

      await sendBusDetailsToWebhook(webhookUrl, originCode, destinationCode, departureDate, buses, url);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function checkAvailabilityPeriodically() {
  for (const url of urls) {
    if (url.includes('train')) {
      await checkTrainTicket(url, webhookUrl);
    } else if (url.includes('flights')) {
      await checkFlightAvailability(url, webhookUrl);
    } else if (url.includes('bus')) {
      await checkBusTicket(url, webhookUrl);
    }
  }

  setTimeout(checkAvailabilityPeriodically, 5000);
}

checkAvailabilityPeriodically();
