import styles from "@/styles/dashboard/staff/StaffPage.module.scss";
import FormStaff from "@/components/dashboard/Staff/form-staff";
import ListStaff from "@/components/dashboard/Staff/list-staff";

export default function StaffPage() {
  return (
    <div className={styles.staff_page_container}>
      <FormStaff></FormStaff>
      <ListStaff></ListStaff>
    </div>
  );
}
