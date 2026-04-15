"use client";

import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "../../convex/_generated/api";

export default function Home({
  preloaded,
}: {
  preloaded: Preloaded<typeof api.myFunctions.listNumbers>;
}) {
  const data = usePreloadedQuery(preloaded);
  const addNumber = useMutation(api.myFunctions.addNumber);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Reactive client-loaded data</CardTitle>
          <CardDescription>
            This section stays live on the client after the server preloads the
            first payload.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <code className="block overflow-x-auto rounded-lg border bg-muted/40 p-4">
            <pre className="text-sm text-muted-foreground">
              {JSON.stringify(data, null, 2)}
            </pre>
          </code>
        </CardContent>
      </Card>
      <div className="flex justify-center">
        <Button onClick={() => void addNumber({ value: Math.floor(Math.random() * 10) })}>
          Add a random number
        </Button>
      </div>
    </>
  );
}
