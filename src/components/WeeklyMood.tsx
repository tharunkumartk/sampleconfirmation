import { Box, Button, Typography } from "@mui/material";
import { MoodEntry } from "../utils/types";
import { useState, useEffect } from "react";
import { Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";

interface MoodChartProps {
  moodPoints: { x: number; y: number }[];
  stressPoints: { x: number; y: number }[];
}

interface WeeklyMoodProps {
  moods: MoodEntry[];
}
const getStartEndDates = (weeksBack: number) => {
  const currDate = new Date();
  const startWeek = new Date();
  const endWeek = new Date();
  startWeek.setDate(currDate.getDate() - 7 * weeksBack - currDate.getDay());
  endWeek.setDate(currDate.getDate() - 7 * weeksBack + (7 - currDate.getDay()));
  const dates =
    weeksBack === 0
      ? "This week"
      : weeksBack === 1
      ? "Last week"
      : startWeek.getMonth() +
        "/" +
        startWeek.getDate() +
        " - " +
        endWeek.getMonth() +
        "/" +
        endWeek.getDate();
  return { stringRep: dates, start: startWeek, end: endWeek };
};

const days = ["M", "Tu", "W", "Th", "F", "Sa", "Su"];

const MoodChart = ({ moodPoints, stressPoints }: MoodChartProps) => {
  const postMoodPoints = [];
  for (let i = 0; i < moodPoints.length; i += 1) {
    postMoodPoints.push({
      day: days[moodPoints[i].x],
      Happiness: moodPoints[i].y,
      Peacefulness: stressPoints[i].y,
    });
  }
  console.log(moodPoints);
  return (
    <LineChart width={800} height={300} data={postMoodPoints}>
      <XAxis dataKey="day" />
      <YAxis minTickGap={1} ticks={[0, 1, 2, 3, 4, 5]} />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="Happiness" stroke="black" />
      <Line type="monotone" dataKey="Peacefulness" stroke="red" />
    </LineChart>
  );
};
const WeeklyMood = ({ moods }: WeeklyMoodProps) => {
  const [moodPoints, setMoodPoints] = useState<{ x: number; y: number }[]>([]);
  const [stressPoints, setStressPoints] = useState<{ x: number; y: number }[]>(
    []
  );
  const [weeksBack, setWeeksBack] = useState(0);
  useEffect(() => {
    const isInMoodRange = (checkDate: Date) => {
      const { start, end } = getStartEndDates(weeksBack);
      console.log(start, end);
      return start <= checkDate && checkDate <= end;
    };
    // for each mood in moods, if the date is within the week, add it to the points
    const newMoodPoints = [];
    const newStressPoints = [];
    for (let i = 0; i < moods.length; i++) {
      const mood = moods[i];
      const moodDate = new Date(mood.timeStamp);
      if (isInMoodRange(moodDate)) {
        // add the mood to the points, where the x value depends on the time of day. ex. for monday, 00:00 is -.5, 23:59 is .5
        const xVal = moodDate.getDay() - 0.5 + moodDate.getHours() / 24;
        newMoodPoints.push({ x: xVal, y: mood.moodValue / 2 });
        newStressPoints.push({ x: xVal, y: mood.stressValue / 2 });
      }
    }

    // sort the points by x value
    newMoodPoints.sort((a, b) => a.x - b.x);
    newStressPoints.sort((a, b) => a.x - b.x);

    // remove duplicates from the points
    for (let i = 0; i < newMoodPoints.length - 1; i++) {
      if (newMoodPoints[i].x === newMoodPoints[i + 1].x) {
        newMoodPoints.splice(i, 1);
        i--;
      }
    }
    for (let i = 0; i < newStressPoints.length - 1; i++) {
      if (newStressPoints[i].x === newStressPoints[i + 1].x) {
        newStressPoints.splice(i, 1);
        i--;
      }
    }

    setMoodPoints(newMoodPoints);
    setStressPoints(newStressPoints);
  }, [weeksBack, moods]);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          marginBottom: "3vh",
        }}
      >
        <Box>
          <Typography fontWeight={600}>Weekly Mood</Typography>
          <Typography>{getStartEndDates(weeksBack).stringRep}</Typography>
        </Box>
        <Box sx={{ flex: 1 }}></Box>
        <Button
          variant="contained"
          sx={{ marginRight: "1vw", marginLeft: "1vw" }}
          onClick={() => setWeeksBack(weeksBack + 1)}
        >
          Previous Week
        </Button>
        <Button
          variant="contained"
          disabled={weeksBack === 0}
          sx={{ marginRight: "1vw", marginLeft: "1vw" }}
          onClick={() => setWeeksBack(weeksBack - 1)}
        >
          Next Week
        </Button>
      </Box>

      <MoodChart moodPoints={moodPoints} stressPoints={stressPoints} />
    </Box>
  );
};

export default WeeklyMood;
