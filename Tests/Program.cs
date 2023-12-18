using System;

namespace SatorImaging.DocFXPages.Tests
{
    /// <summary>Hi, `shown as inline code?`</summary>
    public class TestClass
    {
        /// <summary>Summary</summary>
        /// <remarks>Remarks</remarks>
        public static string StaticStringField;
        public float FloatField;

        public TestClass() { }
    }

    public sealed class SealedClass : TestClass
    {
        [Obsolete]
        public static int StaticObsoleteField;

        [Obsolete("Obsolete!")]
        public double ObsoleteField;

        public SealedClass() { }
        public SealedClass(float val) { }
    }

    [Obsolete("This class is deprecated!")]
    public class DeprecatedClass {}

    /// <summary>
    /// This is sealed class.<br/>
    /// markdown enabled?? <a href='https://www.sator-imaging.com/'>HTML Link Tag</a>
    /// ```csharp
    /// // code block.
    /// UnityEngine.Debug.Log("Hello, world.");
    /// ```
    /// </summary>
    public static class Program
    {
        /// <summary>**Is this shown as bold??**</summary>
        public static void Main(string[] args) { }
    }
}
