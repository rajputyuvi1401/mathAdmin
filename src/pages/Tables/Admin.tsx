import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne";

export default function Admin() {
  return (
    <>
      <PageMeta
        title="Mathlatics Dashboard"
        description="Dashboard for Mathlatics Admin Panel"
      />
      <PageBreadcrumb pageTitle="Registrations" />
      <div className="space-y-6">
        <ComponentCard title="Registration">
          <BasicTableOne />
        </ComponentCard>
      </div>
    </>
  );
}
