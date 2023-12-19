using System;
using System.ComponentModel;

namespace SatorImaging.DocFXPages.Tests.Instances
{

    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Struct)]
    public class MyAttribute : Attribute { }

    public interface IMarkerInterface { }

    /// <summary>
    /// Hi, `shown as inline code?`
    /// I'm also appear in inheritance documents if &lt;inheritdoc/&gt; works.
    /// </summary>
    public class TestClass
    {
        /// <summary>Summary</summary>
        /// <remarks>Remarks</remarks>
        public static string StaticStringField;
        /// <remarks>Remarks</remarks>
        public float FloatField;

        public TestClass() { }
    }

    /// <inheritdoc/>
    public sealed class SealedClass : TestClass
    {
        [Obsolete]
        public static int StaticObsoleteField;

        [Obsolete("Obsolete!")]
        public double ObsoleteField;

        [Obsolete("<b>HTML bold tag can be used??</b> **Markdown bold syntax enabled??**")]
        public SealedClass() { }
        public SealedClass(float val) { }
    }

    /// <summary>*Is this shown as italic??*</summary>
    [Obsolete("This class is deprecated!")]
    public class DeprecatedClass {}
}

namespace SatorImaging.DocFXPages.Tests.Hidden
{
    [EditorBrowsable(EditorBrowsableState.Never)]
    public class HiddenClass
    {
        [EditorBrowsable(EditorBrowsableState.Never)]
        public static void HiddenMethod() { }
    }
}

namespace SatorImaging.DocFXPages.Tests
{
    /// <summary>~~Is this shown as strikethrough??~~</summary>
    public enum Enum
    {
        Default,
        Exceeded = 9999,
    }

    /// <summary>
    /// This is sealed class.<br/>
    /// ```csharp
    /// // code block.
    /// UnityEngine.Debug.Log("Hello, world.");
    /// ```
    /// markdown enabled?? <a href='https://www.sator-imaging.com/'>This is HTML Link Tag</a>
    /// </summary>
    public static class Program
    {
        /// <summary>**Is this shown as bold??**</summary>
        /// <remarks>none</remarks>
        /// <returns>void</returns>
        /// <param name="args">command line args</param>
        public static void Main(string[] args) { }
    }
}
