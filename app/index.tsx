import React, { ReactNode } from "react";
import { Button, FlatList, Text, View } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";

interface ContainerProps {
  children: ReactNode;
}

export default function Index() {
  const API_URL =
    "https://api.open-meteo.com/v1/forecast?latitude=-6.9181&longitude=106.9267&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m";

  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(API_URL);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Container>
      <View className={"my-5"}>
        <Text className={"text-2xl font-semibold text-center mb-2"}>
          Cuaca hari ini di Sukabumi
        </Text>
        <Text className={"text-center"}>Weather App using OpenMateo API</Text>
      </View>
      <FlatList
        data={data.hourly?.time || []}
        keyExtractor={(item, index) => String(index)}
        renderItem={({ item, index }) => {
          const date = new Date(item);
          let isNewDay = false;
          if (index === 0) {
            isNewDay = true;
          } else {
            const prevDate = new Date(data.hourly?.time[index - 1]);
            isNewDay = date.getDate() !== prevDate.getDate();
          }

          return (
            <View>
              {isNewDay && (
                <Text className={"text-lg font-bold mb-3"}>
                  {date.toLocaleDateString(undefined, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                </Text>
              )}
              <View className={"mb-3 bg-white p-5 rounded-2xl"}>
                <Text>Time: {date.toLocaleTimeString()}</Text>
                <Text>Temperature: {data.hourly?.temperature_2m[index]}°C</Text>
                <Text>
                  Humidity: {data.hourly?.relative_humidity_2m[index]}%
                </Text>
                <Text>
                  Wind Speed: {data.hourly?.wind_speed_10m[index]}km/h
                </Text>
              </View>
            </View>
          );
        }}
      />
    </Container>
  );
}

const Container = ({ children }: ContainerProps) => {
  return <View className={"container px-5"}>{children}</View>;
};
