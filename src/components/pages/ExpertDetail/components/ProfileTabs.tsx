// C:\project\FE\src\components\pages\ExpertDetail\components\ProfileTabs.tsx

interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function ProfileTabs({
  activeTab,
  setActiveTab,
}: ProfileTabsProps) {
  const tabs = ['전문가', '강의', '매거진', '후기', '토론'];

  return (
    <div className="flex border-b border-gray-200">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`flex-1 py-4 text-center ${
            activeTab === tab
              ? 'border-b-2 border-primary text-black font-medium'
              : 'text-gray-500'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
