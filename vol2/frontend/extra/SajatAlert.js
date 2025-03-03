import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Image } from 'react-native';

const SajatAlert = ({ visible, title, description, onClose }) => {
  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          <Image source={require('./success.png')} style={styles.kepStilus} />
          <Text style={styles.cim}>{title}</Text>
          <Text style={styles.leiras}>{description}</Text>
          <TouchableOpacity style={styles.gomb} onPress={onClose}>
            <Text style={styles.gombSzoveg}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  alertContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  kepStilus: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  cim: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  leiras: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  gomb: {
    backgroundColor: '#6a11cb',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  gombSzoveg: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
export default SajatAlert;