export type RetirementMeetingStyle = "virtual" | "home" | "office" | "phone";

export const RETIREMENT_SCHEDULER_URLS = {
  virtual:
    "https://scheduler.zoom.us/christian-pennachietti/30-minute-meeting-with-christian",
  phone:
    "https://scheduler.zoom.us/christian-pennachietti/30-minute-meeting-with-christian",
  home:
    "https://scheduler.zoom.us/christian-pennachietti/in-person-meeting-with-christian",
  office:
    "https://scheduler.zoom.us/christian-pennachietti/in-person-meeting-with-christian",
} as const satisfies Record<RetirementMeetingStyle, string>;

