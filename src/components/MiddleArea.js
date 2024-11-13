import React, { useState, useEffect } from "react";

export default function MiddleArea({
  motions,
  onPlay,
  onDropMotion,
  onDeleteMotion,
  onUpdateMotions,
  currentSprite,
  swapActions, // Add swapActions to the props here
}) {
  const [actionTabs, setActionTabs] = useState([{ id: currentSprite.id, label: `Action 1` }]);
  const [selectedTab, setSelectedTab] = useState(currentSprite.id);

  useEffect(() => {
    if (currentSprite && !actionTabs.some((tab) => tab.id === currentSprite.id)) {
      const newTab = { id: currentSprite.id, label: `Action ${currentSprite.id === 1 ? 1 : 2}` };
      setActionTabs((prevTabs) => [...prevTabs, newTab]);
      setSelectedTab(currentSprite.id); 
    }
  }, [currentSprite, actionTabs]);

  const handleDrop = (e, spriteId) => {
    e.preventDefault();
    const motion = e.dataTransfer.getData("motion");
    if (motion) {
      onDropMotion(motion, spriteId); 
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleAddActionTab = () => {
    const newTab = {
      id: `${currentSprite.id}-${actionTabs.length + 1}`,
      label: `Action ${actionTabs.length + 1}`,
    };
    setActionTabs((prevTabs) => [...prevTabs, newTab]);
    setSelectedTab(newTab.id);
  };

  const handleRunAction = (tabId) => {
    if (motions[tabId] && motions[tabId].length > 0) {
      const motionsForSelectedTab = motions[tabId];
      onPlay(tabId, motionsForSelectedTab);
    }
  };

  const handleRunAllActions = () => {
    actionTabs.forEach((tab) => {
      if (motions[tab.id] && motions[tab.id].length > 0) {
        onPlay(tab.id, motions[tab.id]); 
      }
    });
    swapActions(); // Call swapActions here after running all actions
  };


  
  return (
    <div className="bg-white p-4 w-full flex flex-col h-full border border-gray-300 rounded-md overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <div className="flex">
          {actionTabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-2 ${selectedTab === tab.id ? "bg-green-500 text-white" : "bg-gray-200"} rounded-tl`}
              onClick={() => setSelectedTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {actionTabs.length > 0 && (
          <button
            onClick={() => handleRunAllActions()}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Run Hero Feature
          </button>
        )}
      </div>

      <div className="flex flex-col w-full flex-grow overflow-y-auto">
        {actionTabs.map((tab) => (
          <div
            key={tab.id}
            className={`transition-opacity duration-300 ${selectedTab === tab.id ? "block" : "hidden"}`}
            onDrop={(e) => handleDrop(e, tab.id)}
            onDragOver={handleDragOver}
            style={{ minHeight: "500px", border: "1px dashed #ccc", padding: "8px", borderRadius: "8px" }}
          >
            {motions[tab.id] && motions[tab.id].map((motion, index) => (
              <div
                key={index}
                className="mb-2 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer flex justify-between items-center hover:bg-blue-600"
              >
                {motion}
                <button onClick={() => onDeleteMotion(tab.id, index)} className="text-red-500 hover:text-red-700">
                  🗑️
                </button>
              </div>
            ))}
            {(!motions[tab.id] || motions[tab.id].length === 0) && (
              <p className="text-gray-500">Drag motions here</p>
            )}
            {selectedTab === tab.id && motions[tab.id] && motions[tab.id].length > 0 && (
              <button
                onClick={() => handleRunAction(tab.id)} // Run only for the selected tab
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Run {tab.label}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
