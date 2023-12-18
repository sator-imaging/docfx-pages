namespace SatorImaging.DocFXPages.Tests
{
    public class TestClass
    {
        public static string StaticStringField;
        public float FloatField;

        public TestClass() { }
    }

    public sealed class SealedClass : TestClass
    {
        public SealedClass() { }
        public SealedClass(float val) { }
    }

    public static class Program
    {
        public static void Main(string[] args) { }
    }
}
