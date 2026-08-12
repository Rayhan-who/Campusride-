export type BookingStatus = "Confirmed" | "Pending" | "Cancelled" | "Completed";

export type NotificationType =
  | "booking_confirmed"
  | "seat_updated"
  | "schedule_changed"
  | "counter_changed"
  | "event_announced"
  | "event_booking_confirmed"
  | "cancellation";

export type DemandLevel = "Low" | "Medium" | "High" | "Very High";

export interface Profile {
  id: string;
  full_name: string;
  student_id: string;
  university_email: string;
  department: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Bus {
  id: string;
  bus_number: string;
  capacity: number;
}

export interface Route {
  id: string;
  name: string;
  description: string | null;
  is_demo: boolean;
}

export interface Counter {
  id: string;
  name: string;
  pickup_location: string;
  map_x: number;
  map_y: number;
  route_id: string | null;
  is_demo: boolean;
}

export interface Schedule {
  id: string;
  bus_id: string;
  route_id: string;
  counter_id: string;
  departure_time: string;
  arrival_time: string;
  capacity: number;
  days_of_week: number[];
  is_demo: boolean;
}

export interface ScheduleWithDetails extends Schedule {
  bus: Bus;
  route: Route;
  counter: Counter;
  available_seats: number;
}

export interface Booking {
  id: string;
  booking_code: string;
  user_id: string;
  schedule_id: string;
  travel_date: string;
  seats_requested: number;
  seats_allocated: number;
  status: BookingStatus;
  created_at: string;
}

export interface BookingWithSchedule extends Booking {
  schedule: ScheduleWithDetails;
}

export interface EventItem {
  id: string;
  name: string;
  description: string | null;
  event_date: string;
  destination: string;
  departure_time: string | null;
  return_time: string | null;
  total_seats: number;
  is_demo: boolean;
}

export interface EventWithAvailability extends EventItem {
  available_seats: number;
}

export interface EventBooking {
  id: string;
  booking_code: string;
  user_id: string;
  event_id: string;
  seats_requested: number;
  seats_allocated: number;
  status: BookingStatus;
  created_at: string;
}

export interface EventBookingWithEvent extends EventBooking {
  event: EventItem;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface CounterDemand {
  counter: Counter;
  earlyBookingCount: number;
  demandLevel: DemandLevel;
}
