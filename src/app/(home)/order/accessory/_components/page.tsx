import CategorySection from "./_components/CategorySection";

function DoorCategoryPage() {
  return (
    <div className="mx-5 flex flex-col gap-4 pt-8">
      <h1 className="text-lg font-bold">부속 종류를 선택해주세요</h1>
      <CategorySection />
    </div>
  );
}

export default DoorCategoryPage;
