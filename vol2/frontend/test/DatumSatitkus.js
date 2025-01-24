import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Tanulo_Datumok = ({ atkuld }) => {
  const events = [
    { id: '1', title: 'Marketing team meeting', time: '08:00 - 08:40 AM', color: '#FDEEDC' },
    { id: '2', title: 'Make plans to create new products', time: '09:00 - 09:40 AM', color: '#E8DFF5' },
    { id: '3', title: 'Coffee breaks and snacks', time: '10:00 - 10:15 AM', color: '#D6EFFF' },
    { id: '4', title: 'Company policy meeting', time: '11:00 - 11:45 AM', color: '#F5D8E8' },
    { id: '5', title: 'Have lunch', time: '12:00 - 12:30 PM', color: '#FDEEDC' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => atkuld('back')}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.month}>January</Text>
        <Ionicons name="search-outline" size={24} color="black" />
      </View>

      {/* Date Selector */}
      <View style={styles.dateSelector}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <View key={index} style={index === 2 ? styles.selectedDate : styles.dateItem}>
            <Text style={index === 2 ? styles.selectedText : styles.dateText}>{day}</Text>
            <Text style={index === 2 ? styles.selectedText : styles.dateText}>{index + 1}</Text>
          </View>
        ))}
      </View>

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
      />

      {/* Add Event Button */}
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add" size={36} color="white" />
      </TouchableOpacity>
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
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dateItem: {
    alignItems: 'center',
  },
  selectedDate: {
    alignItems: 'center',
    backgroundColor: '#D6EFFF',
    borderRadius: 10,
    padding: 5,
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
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#5C9EFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Tanulo_Datumok;
