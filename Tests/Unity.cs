using UnityEngine;

namespace Tests.Unity
{
    /// <summary>
    /// `EditorOnlyMethod` must be included in API Reference.
    /// (defined in `#if UNITY_EDITOR` directive)
    /// </summary>
    public class MyBehaviour : MonoBehaviour
    {
        [SerializeField] float FloatValue;

        public void Update() { }
        public void GenericMethod() { }

    #if UNITY_EDITOR
        public static void EditorOnlyMethod() { }
    #endif

    }
}
