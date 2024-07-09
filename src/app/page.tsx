'use client';

import React, { useEffect, useState } from 'react';

export default function Home() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const message = localStorage.getItem('successMessage');
    if (message) {
      setSuccessMessage(message);
      localStorage.removeItem('successMessage');
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    }
  }, []);

  return (
      <main>
        <div className="flex min-h-screen flex-col items-center p-12">
          {successMessage && (
              <div className="bg-green-100 border-t border-b border-green-500 text-green-700 px-4 py-3 mb-4"
                   role="alert">
                <p className="text-sm">{successMessage}</p>
              </div>
          )}
          <h1 className="text-center text-6xl font-semibold mb-12">
            J.B. HUNT PING PONG ELO
          </h1>

          <div className="w-full max-w-4xl p-12 bg-white rounded shadow-md">
            <p className="mb-6">
              Welcome to the J.B. Hunt Intern Ping Pong ELO site. Here, interns can play ping pong matches against each
              other, and their approximate skill level can be estimated by their ELO.
            </p>
            <h2 className="text-2xl font-bold mb-4">General Info / Tips:</h2>
            <ul className="list-disc list-inside mb-6">
              <li>
                This is a private website only for J.B. Hunt employees! If you are an intern (or manager!) and want to
                participate, send me (Nicholas Robinson) a message on Teams, and I will give you an invite code to use
                to sign up.
              </li>
              <li>
                The rating system is based off of the chess ELO system. You gain or lose rating points based on:
                <ul className="list-disc list-inside ml-5">
                  <li>Whether you win or lose</li>
                  <li>How much you win or lose by</li>
                  <li>Your rating and your opponent&apos;s rating</li>
                </ul>
              </li>
              <li>
                All these factors play a role in your rating change in a match. The ranking system and displayed ELO
                work slightly differently - everyone starts at an ELO of 0, but the ELO used for match calculations is
                actually 1200. Through your first 7 matches, you will be &quot;gaining&quot; these points back. This system is
                similar to the one used in Codeforces. Read more about it <a
                  href="https://codeforces.com/blog/entry/77890" className="text-blue-500 underline">here</a>.
              </li>
              <li>
                Your rank is based on your ELO range. These ranks are based loosely on Codeforces and don&apos;t have any
                other effect than determining the entirety of your self-worth as a ping pong player...
              </li>
            </ul>
            <h2 className="text-2xl font-bold mb-4">Match Rules:</h2>
            <ul className="list-disc list-inside mb-6">
              <li>Games are to 21, play deuce if you both get there</li>
              <li>Switch serves every 2 or 5, depending on preference of you and your opponent</li>
              <li>If you have any concerns or questions, please contact me</li>
            </ul>
            <h2 className="text-2xl font-bold mb-4">Once a Match is Completed:</h2>
            <ul className="list-disc list-inside mb-6">
              <li>Either you OR your opponent will submit your scores on the &quot;Submit Match&quot; page.</li>
              <li>NOTE: NOT BOTH! JUST ONE OF YOU! Communicate with your opponent about who will submit.</li>
              <li>We are on the honor system here! Please don&apos;t cheat.</li>
              <li>Once you submit your match, view the leaderboards page to see where you rank against other interns!
              </li>
              <li>View your profile or other players&apos; profiles to see your/their match history and stats.</li>
            </ul>
          </div>
        </div>
      </main>
  );
}