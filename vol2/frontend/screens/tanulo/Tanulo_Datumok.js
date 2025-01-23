import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Tanulo_Datumok = ({ atkuld }) => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [isExpanded, setIsExpanded] = useState(false);

  const eventsByDate = {
    '2025-01-03': [
      { id: '1', title: 'Marketing team meeting', time: '08:00 - 08:40 AM', color: '#FDEEDC' },
      { id: '2', title: 'Make plans to create new products', time: '09:00 - 09:40 AM', color: '#E8DFF5' },
      { id: '3', title: 'Coffee breaks and snacks', time: '10:00 - 10:15 AM', color: '#D6EFFF' },
    ],
    '2025-01-04': [
      { id: '4', title: 'Team brainstorming session', time: '08:30 - 09:30 AM', color: '#F5D8E8' },
      { id: '5', title: 'Design review meeting', time: '10:00 - 11:00 AM', color: '#D6EFFF' },
      { id: '6', title: 'Lunch with clients', time: '12:00 - 01:00 PM', color: '#FDEEDC' },
    ],
    '2025-01-05': [
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

  const toggleCalendarView = () => {
    setIsExpanded(!isExpanded);
  };

  const renderCompactRow = () => {
    const currentDay = today.getDate();
    const daysToShow = 5; // Show 5 days in compact view
    const startDay = Math.max(1, currentDay - Math.floor(daysToShow / 2));
    const endDay = Math.min(getDaysInMonth(today.getFullYear(), today.getMonth()), startDay + daysToShow - 1);

    const days = [];
    for (let day = startDay; day <= endDay; day++) {
      days.push(day);
    }

    return (
      <View style={styles.compactRow}>
        {days.map((day) => (
          <TouchableOpacity
            key={day}
            onPress={() => handleDatePress(day)}
            style={
              selectedDate.getDate() === day
                ? styles.selectedDateCompact
                : styles.dateItemCompact
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
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.month}>{renderCalendarHeader()}</Text>
        <TouchableOpacity onPress={toggleCalendarView}>
          <Ionicons
            name={isExpanded ? 'arrow-up' : 'arrow-down'}
            size={24}
            color="black"
          />
        </TouchableOpacity>
      </View>

      {/* Compact View */}
      {!isExpanded && renderCompactRow()}

      {/* Full Calendar View */}
      {isExpanded && (
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
      )}

      {/* Event List */}
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.eventItem, { backgroundColor: item.color }]}>  
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text style={styles.eventTime}>{item.time}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.noEvents}>No events for this day</Text>}
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
  compactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
  dateItemCompact: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
  },
  selectedDateCompact: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#D6EFFF',
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
