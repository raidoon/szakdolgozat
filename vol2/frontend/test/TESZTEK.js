//innen királyul néz ki a lista és a színei!

/*
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Tanulo_Datumok = ({ atkuld }) => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);

  const eventsByDate = {
    '2025-01-23': [
      { id: '1', title: 'Indulás a buszvégállomásról', time: '08:00 - 10:00 AM', color: '#FDEEDC' },
      { id: '2', title: 'Indulás a Szepességi utcáról', time: '09:00 - 09:40 AM', color: '#E8DFF5' },
      { id: '3', title: 'Petőfi utca', time: '10:00 - 10:15 AM', color: '#D6EFFF' },
    ],
    '2025-01-04': [
      { id: '4', title: 'Team brainstorming session', time: '08:30 - 10:30 AM', color: '#F5D8E8' },
      { id: '5', title: 'Design review meeting', time: '11:00 - 11:30 AM', color: '#D6EFFF' },
      { id: '6', title: 'Lunch with clients', time: '12:00 - 01:00 PM', color: '#FDEEDC' },
    ],
    '2025-01-25': [
      { id: '7', title: 'Weekly report submission', time: '09:00 - 09:30 AM', color: '#E8DFF5' },
      { id: '8', title: 'Project update call', time: '11:00 - 11:45 AM', color: '#D6EFFF' },
    ],
  };

  const events = eventsByDate[selectedDate.toISOString().split('T')[0]] || [];

  const renderCalendarHeader = () => {
    const monthName = selectedDate.toLocaleString('default', { month: 'long' });
    const year = selectedDate.getFullYear();
    return `${monthName} ${year}`;
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  const handleDatePress = (day) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(day);
    setSelectedDate(newDate);
  };

  const changeMonth = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(selectedDate.getMonth() + direction);
    setSelectedDate(newDate);
  };

  return (
    <View style={styles.container}>
      {/* Header *//*}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => changeMonth(-1)}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.month}>{renderCalendarHeader()}</Text>
        <TouchableOpacity onPress={() => changeMonth(1)}>
          <Ionicons name="arrow-forward" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Date Selector *//*}
      <View style={styles.dateSelector}>
        {generateCalendarDays().map((day) => (
          <TouchableOpacity
            key={day}
            onPress={() => handleDatePress(day)}
            style={
              selectedDate.getDate() === day
                ? styles.selectedDate
                : styles.dateItem
            }
          >
            <Text
              style={
                selectedDate.getDate() === day
                  ? styles.selectedText
                  : styles.dateText
              }
            >
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Event List *//*}
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.eventItem, { backgroundColor: item.color }]}>  
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text style={styles.eventTime}>{item.time}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.noEvents}>Ezen a napon nincsenek óráid</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  month: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  dateSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dateItem: {
    width: '13%',
    alignItems: 'center',
    marginVertical: 5,
  },
  selectedDate: {
    width: '13%',
    alignItems: 'center',
    backgroundColor: '#D6EFFF',
    borderRadius: 10,
    padding: 5,
    marginVertical: 5,
  },
  dateText: {
    color: '#888',
  },
  selectedText: {
    color: '#000',
    fontWeight: 'bold',
  },
  eventItem: {
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  eventTime: {
    fontSize: 14,
    color: '#555',
  },
  noEvents: {
    textAlign: 'center',
    color: '#888',
    fontStyle: 'italic',
    marginTop: 20,
  },
});

export default Tanulo_Datumok;
 */