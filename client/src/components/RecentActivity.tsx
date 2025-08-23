import { useQuery } from "@tanstack/react-query";
import { Clock } from "lucide-react";
import { Activity } from "@shared/schema";

export default function RecentActivity() {
  const { data: activities = [] } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });

  const getActivityColor = (type: string) => {
    switch (type) {
      case "problem_solved":
        return "border-secondary";
      case "submission_made":
        return "border-primary";
      case "contest_joined":
        return "border-purple-500";
      default:
        return "border-slate-300";
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div data-testid="recent-activity">
      <div className="flex items-center mb-4">
        <Clock className="w-5 h-5 text-secondary mr-2" />
        <h2 className="text-lg font-semibold">Recent Activity</h2>
      </div>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div 
            key={activity.id} 
            className={`border-l-4 ${getActivityColor(activity.type)} pl-4`}
            data-testid={`activity-${index}`}
          >
            <div className="text-sm">
              <span className="text-slate-600" data-testid={`text-activity-description-${activity.id}`}>
                {activity.description}
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-1" data-testid={`text-activity-time-${activity.id}`}>
              {formatTimeAgo(activity.createdAt)}
            </div>
          </div>
        ))}
      </div>
      <button 
        className="w-full mt-4 text-primary text-sm font-medium hover:text-blue-700 transition-colors"
        data-testid="button-view-all-activity"
      >
        View All Activity
      </button>
    </div>
  );
}
