const ClassSchedule = ({ formDataList }) => {
  const formatTo12Hour = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return {
      formattedTime: `${formattedHours}:${minutes.toString().padStart(2, "0")}`,
      ampm,
    };
  };

  const totalUnits = formDataList.reduce((sum, formData) => {
    const units = parseInt(formData.units) || 0;
    return sum + units;
  }, 0);

  return (
    <div id="schedule-container" style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <header style={{ fontSize: "24px", fontWeight: "bold" }}>
          Schedule ({totalUnits})
        </header>
      </div>
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        {formDataList.map((formData, index) => {
          const start = formatTo12Hour(formData.startTime);
          const end = formatTo12Hour(formData.endTime);

          return (
            <div
              key={index}
              style={{
                backgroundColor: formData.color,
                borderRadius: "6px",
                padding: "12px 24px 12px 12px",
              }}
            >
              <div>
                <strong>
                  {formData.title} ({formData.units}){" "}
                </strong>
                <span>{formData.days}: </span>
                {start.formattedTime}{" "}
                {start.ampm === end.ampm
                  ? `- ${end.formattedTime} ${end.ampm}`
                  : `${start.ampm} - ${end.formattedTime} ${end.ampm}`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClassSchedule;
