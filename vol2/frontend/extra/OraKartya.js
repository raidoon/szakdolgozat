import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ScheduleCard = ({ date, type, time }) => (
  <View key={item.ora_id} style={{
                        flexDirection: "row",
                        backgroundColor: "#FFF",
                        padding: 15,
                        borderRadius: 10,
                        marginVertical: 5,
                        alignItems: "center",
                        shadowColor: "#000",
                        shadowOpacity: 0.1,
                        shadowRadius: 5,
                        elevation: 3,
                      }}>
                        <View style={{
                            marginRight: 15,
                            alignItems: "center",
                        }}>
                          <Text style={{
                            fontSize: 14,
                            fontWeight: "bold",
                            color: "#6A5AE0",
                          }}>{`${honap}`}</Text>
                          <Text style={{
                            fontSize: 18,
                            fontWeight: "bold",
                          }}>{`${nap}`}</Text>
                        </View>
                        <Text style={{
                             flex: 1,
                             fontSize: 16,
                        }}>{`${oraTipusSzoveg}`}</Text>
                        <Text style={{
                             fontSize: 16,
                             fontWeight: "bold",
                        }}>{`${oraPerc}`}</Text>
                      </View>
);
/**
 * 
 * <View key={item.ora_id} style={[styles.OraView]}>
                    <View>
                      <Text style={styles.oraBaloldal}>{`${honap}`}</Text>
                      <Text style={styles.oraBaloldal}>{`${nap}`}</Text>
                    </View>
                    <Text
                      styles={styles.oraKozepsoResz}
                    >{`${oraTipusSzoveg}`}</Text>
                    <Text style={styles.oraJobbOldal}>{`${oraPerc}`}</Text>
                  </View>
 */
const ScheduleTimeline = ({ date, type, time }) => (
  <View key={item.ora_id} style={{
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  }}>
    <Ionicons name="time-outline" size={24} color="#6A5AE0" style={{
         marginRight: 10,
    }} />
    <View>
      <Text style={{
        fontSize: 16,
        fontWeight: "bold",
      }}>{`${honap} ${nap}`}</Text>
      <Text style={{
        fontSize: 14,
        color: "#555",
      }}>{`${oraTipusSzoveg}`}</Text>
    </View>
    <Text style={{
        marginLeft: "auto",
        fontSize: 16,
        fontWeight: "bold",
    }}>{`${oraPerc}`}</Text>
  </View>
);

const RoundedBoxSchedule = ({ date, type, time }) => (
  <View key={item.ora_id} style={{
    backgroundColor: "#6A5AE0",
    padding: 15,
    borderRadius: 20,
    marginVertical: 5,
    alignItems: "center",
  }}>
    <Text style={{
         fontSize: 16,
         fontWeight: "bold",
         color: "#FFF",
    }}>{`${honap} ${nap}`}</Text>
    <Text style={{
        fontSize: 14,
        color: "#DDD",
    }}>{`${oraTipusSzoveg}`}</Text>
    <Text style={{
         fontSize: 16,
         fontWeight: "bold",
         color: "#FFF",
    }}>{`${oraPerc}`}</Text>
  </View>
);

const OraListaJS = ({ orakLista }) => {
  return (
    <FlatList
      data={orakLista}
      keyExtractor={(item) => item.ora_id.toString()}
      renderItem={({ item }) => {
        const date = new Date(item.ora_datuma);
        const formattedDate = {
          month: date.toLocaleDateString("hu-HU", { month: "short" }).toUpperCase(),
          day: date.toLocaleDateString("hu-HU", { day: "2-digit" })
        };
        const time = date.toLocaleTimeString("hu-HU", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
        const type = item.ora_tipusID === 1 ? "Tanóra" : "Vizsga!";

        return (
          <>
            <ScheduleCard date={formattedDate} type={type} time={time} />
            <ScheduleTimeline date={formattedDate} type={type} time={time} />
            <RoundedBoxSchedule date={formattedDate} type={type} time={time} />
          </>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  timelineDate: {
    
  },
  timelineType: {
    
  },
  timelineTime: {
    
  },

  roundedBox: {
    
  },
  roundedBoxDate: {
   
  },
  roundedBoxType: {
    
  },
  roundedBoxTime: {
   
  },
});

export default OraListaJS;