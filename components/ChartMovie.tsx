"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface Rating {
  source: string;
  value: number;
}

export default function MovieChart({ ratingsData }: { ratingsData: Rating[] }) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-center">Ratings Distribution</h2>
      {ratingsData.length>0?<ResponsiveContainer width="100%" height={300}>
        <BarChart data={ratingsData}>
          <XAxis dataKey="source" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>:<h1>This Movie has no Ratings yet</h1>}
    </div>
  );
}
